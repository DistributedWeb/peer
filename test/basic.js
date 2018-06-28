var DWebPeer = require('../')
var dWebPeerTest = require('tape')

dWebPeerTest('dWeb DWebPeer Tests: Beam event gets emitted', function (t) {
  var dWebPeer = new DWebPeer({ initiator: true })
  dWebPeer.once('beam', function () {
    t.pass('got beam event')
    dWebPeer.destroy()
    t.end()
  })
})

dWebPeerTest('dWeb DWebPeer Tests: Data send/receive text', function (t) {
  var dWebPeer1 = new DWebPeer({ initiator: true })
  var dWebPeer2 = new DWebPeer()

  var numSignal1 = 0
  dWebPeer1.on('beam', function (data) {
    numSignal1 += 1
    dWebPeer2.beam(data)
  })

  var numSignal2 = 0
  dWebPeer2.on('beam', function (data) {
    numSignal2 += 1
    dWebPeer1.beam(data)
  })

  dWebPeer1.on('connect', tryTest)
  dWebPeer2.on('connect', tryTest)

  function tryTest () {
    if (!dWebPeer1.connected || !dWebPeer2.connected) return

    t.ok(numSignal1 >= 1)
    t.ok(numSignal2 >= 1)
    t.equal(dWebPeer1.initiator, true, 'dWebPeer1 is initiator')
    t.equal(dWebPeer2.initiator, false, 'dWebPeer2 is not initiator')

    dWebPeer1.send('sup dWebPeer2')
    dWebPeer2.on('data', function (data) {
      t.equal(data, 'sup dWebPeer2', 'got correct message')

      dWebPeer2.send('sup dWebPeer1')
      dWebPeer1.on('data', function (data) {
        t.equal(data, 'sup dWebPeer1', 'got correct message')

        function tryDone () {
          if (!dWebPeer1.connected && !dWebPeer2.connected) {
            t.pass('both dWebPeers closed')
            t.end()
          }
        }

        dWebPeer1.destroy(tryDone)
        dWebPeer2.destroy(tryDone)
      })
    })
  }
})

dWebPeerTest('dWeb DWebPeer Tests: Disable trickle', function (t) {
  var dWebPeer1 = new DWebPeer({ initiator: true, trickle: false })
  var dWebPeer2 = new DWebPeer({ trickle: false })

  var numSignal1 = 0
  dWebPeer1.on('beam', function (data) {
    numSignal1 += 1
    dWebPeer2.beam(data)
  })

  var numSignal2 = 0
  dWebPeer2.on('beam', function (data) {
    numSignal2 += 1
    dWebPeer1.beam(data)
  })

  dWebPeer1.on('connect', tryTest)
  dWebPeer2.on('connect', tryTest)

  function tryTest () {
    if (!dWebPeer1.connected || !dWebPeer2.connected) return

    t.equal(numSignal1, 1, 'only one `beam` event')
    t.equal(numSignal2, 1, 'only one `beam` event')
    t.equal(dWebPeer1.initiator, true, 'dWebPeer1 is initiator')
    t.equal(dWebPeer2.initiator, false, 'dWebPeer2 is not initiator')

    dWebPeer1.send('sup dWebPeer2')
    dWebPeer2.on('data', function (data) {
      t.equal(data, 'sup dWebPeer2', 'got correct message')

      dWebPeer2.send('sup dWebPeer1')
      dWebPeer1.on('data', function (data) {
        t.equal(data, 'sup dWebPeer1', 'got correct message')

        function tryDone () {
          if (!dWebPeer1.connected && !dWebPeer2.connected) {
            t.pass('both dWebPeers closed')
            t.end()
          }
        }

        dWebPeer1.destroy(tryDone)
        dWebPeer2.destroy(tryDone)
      })
    })
  }
})

dWebPeerTest('dWeb DWebPeer Tests: Disable trickle (only initiator)', function (t) {
  var dWebPeer1 = new DWebPeer({ initiator: true, trickle: false })
  var dWebPeer2 = new DWebPeer()

  var numSignal1 = 0
  dWebPeer1.on('beam', function (data) {
    numSignal1 += 1
    dWebPeer2.beam(data)
  })

  var numSignal2 = 0
  dWebPeer2.on('beam', function (data) {
    numSignal2 += 1
    dWebPeer1.beam(data)
  })

  dWebPeer1.on('connect', tryTest)
  dWebPeer2.on('connect', tryTest)

  function tryTest () {
    if (!dWebPeer1.connected || !dWebPeer2.connected) return

    t.equal(numSignal1, 1, 'only one `beam` event for initiator')
    t.ok(numSignal2 >= 1, 'at least one `beam` event for receiver')
    t.equal(dWebPeer1.initiator, true, 'dWebPeer1 is initiator')
    t.equal(dWebPeer2.initiator, false, 'dWebPeer2 is not initiator')

    dWebPeer1.send('sup dWebPeer2')
    dWebPeer2.on('data', function (data) {
      t.equal(data, 'sup dWebPeer2', 'got correct message')

      dWebPeer2.send('sup dWebPeer1')
      dWebPeer1.on('data', function (data) {
        t.equal(data, 'sup dWebPeer1', 'got correct message')

        function tryDone () {
          if (!dWebPeer1.connected && !dWebPeer2.connected) {
            t.pass('both dWebPeers closed')
            t.end()
          }
        }

        dWebPeer1.destroy(tryDone)
        dWebPeer2.destroy(tryDone)
      })
    })
  }
})

dWebPeerTest('dWeb DWebPeer Tests: Disable trickle (only receiver)', function (t) {
  var dWebPeer1 = new DWebPeer({ initiator: true })
  var dWebPeer2 = new DWebPeer({ trickle: false })

  var numSignal1 = 0
  dWebPeer1.on('beam', function (data) {
    numSignal1 += 1
    dWebPeer2.beam(data)
  })

  var numSignal2 = 0
  dWebPeer2.on('beam', function (data) {
    numSignal2 += 1
    dWebPeer1.beam(data)
  })

  dWebPeer1.on('connect', tryTest)
  dWebPeer2.on('connect', tryTest)

  function tryTest () {
    if (!dWebPeer1.connected || !dWebPeer2.connected) return

    t.ok(numSignal1 >= 1, 'at least one `beam` event for initiator')
    t.equal(numSignal2, 1, 'only one `beam` event for receiver')
    t.equal(dWebPeer1.initiator, true, 'dWebPeer1 is initiator')
    t.equal(dWebPeer2.initiator, false, 'dWebPeer2 is not initiator')

    dWebPeer1.send('sup dWebPeer2')
    dWebPeer2.on('data', function (data) {
      t.equal(data, 'sup dWebPeer2', 'got correct message')

      dWebPeer2.send('sup dWebPeer1')
      dWebPeer1.on('data', function (data) {
        t.equal(data, 'sup dWebPeer1', 'got correct message')

        function tryDone () {
          if (!dWebPeer1.connected && !dWebPeer2.connected) {
            t.pass('both dWebPeers closed')
            t.end()
          }
        }

        dWebPeer1.destroy(tryDone)
        dWebPeer2.destroy(tryDone)
      })
    })
  }
})
