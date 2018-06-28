var DWebPeer = require('../')
var dWebPeerTest = require('tape')

dWebPeerTest('dWeb Peer Binary Tests: Data send/receive Uint8Array', function (t) {
  var dWebPeer1 = new DWebPeer({ initiator: true })
  var dWebPeer2 = new DWebPeer()
  dWebPeer1.on('beam', function (data) {
    dWebPeer2.beam(data)
  })
  dWebPeer2.on('beam', function (data) {
    dWebPeer1.beam(data)
  })
  dWebPeer1.on('connect', tryTest)
  dWebPeer2.on('connect', tryTest)

  function tryTest () {
    if (!dWebPeer1.connected || !dWebPeer2.connected) return

    dWebPeer1.send(new Uint8Array([1, 2, 3]))
    dWebPeer2.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, new Buffer([1, 2, 3]), 'got correct message')

      dWebPeer2.send(new Uint8Array([2, 3, 4]))
      dWebPeer1.on('data', function (data) {
        t.ok(Buffer.isBuffer(data), 'data is Buffer')
        t.deepEqual(data, new Buffer([2, 3, 4]), 'got correct message')

        dWebPeer1.destroy(tryDone)
        dWebPeer2.destroy(tryDone)

        function tryDone () {
          if (!dWebPeer1.connected && !dWebPeer2.connected) {
            t.pass('both dWebPeers closed')
            t.end()
          }
        }
      })
    })
  }
})

dWebPeerTest('dWeb Peer Binary Tests: Data send/receive Buffer', function (t) {
  var dWebPeer1 = new DWebPeer({ initiator: true })
  var dWebPeer2 = new DWebPeer()
  dWebPeer1.on('beam', function (data) {
    dWebPeer2.beam(data)
  })
  dWebPeer2.on('beam', function (data) {
    dWebPeer1.beam(data)
  })
  dWebPeer1.on('connect', tryTest)
  dWebPeer2.on('connect', tryTest)

  function tryTest () {
    if (!dWebPeer1.connected || dWebPeer2.connected) return

    dWebPeer1.send(new Buffer([1, 2, 3]))
    dWebPeer2.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, new Buffer([1, 2, 3]), 'got correct message')

      dWebPeer2.send(new Buffer([2, 3, 4]))
      dWebPeer1.on('data', function (data) {
        t.ok(Buffer.isBuffer(data), 'data is Buffer')
        t.deepEqual(data, new Buffer([2, 3, 4]), 'got correct message')

        dWebPeer1.destroy(tryDone)
        dWebPeer2.destroy(tryDone)

        function tryDone () {
          if (!dWebPeer1.connected && !dWebPeer2.connected) {
            t.pass('both dWebPeers closed')
            t.end()
          }
        }
      })
    })
  }
})

dWebPeerTest('dWeb Peer Binary Tests: Data send/receive ArrayBuffer', function (t) {
  var dWebPeer1 = new DWebPeer({ initiator: true })
  var dWebPeer2 = new DWebPeer()
  dWebPeer1.on('beam', function (data) {
    dWebPeer2.beam(data)
  })
  dWebPeer2.on('beam', function (data) {
    dWebPeer1.beam(data)
  })
  dWebPeer1.on('connect', tryTest)
  dWebPeer2.on('connect', tryTest)

  function tryTest () {
    if (!dWebPeer1.connected || !dWebPeer2.connected) return

    dWebPeer1.send(new Uint8Array([1, 2, 3]).buffer)
    dWebPeer2.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, new Buffer([1, 2, 3]), 'got correct message')

      dWebPeer2.send(new Uint8Array([2, 3, 4]).buffer)
      dWebPeer1.on('data', function (data) {
        t.ok(Buffer.isBuffer(data), 'data is Buffer')
        t.deepEqual(data, new Buffer([2, 3, 4]), 'got correct message')

        dWebPeer1.destroy(tryDone)
        dWebPeer2.destroy(tryDone)

        function tryDone () {
          if (!dWebPeer1.connected && !dWebPeer2.connected) {
            t.pass('both dWebPeers closed')
            t.end()
          }
        }
      })
    })
  }
})
