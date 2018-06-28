var str = require('string-to-stream')
var DWebPeer = require('../')
var dWebPeerTest = require('tape')

dWebPeerTest('dWeb Peer Stream Tests: Duplex stream: send data before "connect" event', function (t) {
  t.plan(9)

  var dWebPeer1 = new DWebPeer({ initiator: true })
  var dWebPeer2 = new DWebPeer()
  dWebPeer1.on('beam', function (data) { dWebPeer2.beam(data) })
  dWebPeer2.on('beam', function (data) { dWebPeer1.beam(data) })

  str('abc').pipe(dWebPeer1)

  dWebPeer1.on('data', function () {
    t.fail('dWebPeer1 should not get data')
  })
  dWebPeer1.on('finish', function () {
    t.pass('got dWebPeer1 "finish"')
    t.ok(dWebPeer1._writableState.finished)
  })
  dWebPeer1.on('end', function () {
    t.pass('got dWebPeer1 "end"')
    t.ok(dWebPeer1._readableState.ended)
  })

  dWebPeer2.on('data', function (chunk) {
    t.equal(chunk.toString(), 'abc', 'got correct message')
  })
  dWebPeer2.on('finish', function () {
    t.pass('got dWebPeer2 "finish"')
    t.ok(dWebPeer2._writableState.finished)
  })
  dWebPeer2.on('end', function () {
    t.pass('got dWebPeer2 "end"')
    t.ok(dWebPeer2._readableState.ended)
  })
})

dWebPeerTest('dWeb Peer Stream Tests: Duplex stream: send data one-way', function (t) {
  t.plan(9)

  var dWebPeer1 = new DWebPeer({ initiator: true })
  var dWebPeer2 = new DWebPeer()
  dWebPeer1.on('beam', function (data) { dWebPeer2.beam(data) })
  dWebPeer2.on('beam', function (data) { dWebPeer1.beam(data) })
  dWebPeer1.on('connect', tryTest)
  dWebPeer2.on('connect', tryTest)

  function tryTest () {
    if (!dWebPeer1.connected || !dWebPeer2.connected) return

    dWebPeer1.on('data', function () {
      t.fail('dWebPeer1 should not get data')
    })
    dWebPeer1.on('finish', function () {
      t.pass('got dWebPeer1 "finish"')
      t.ok(dWebPeer1._writableState.finished)
    })
    dWebPeer1.on('end', function () {
      t.pass('got dWebPeer1 "end"')
      t.ok(dWebPeer1._readableState.ended)
    })

    dWebPeer2.on('data', function (chunk) {
      t.equal(chunk.toString(), 'abc', 'got correct message')
    })
    dWebPeer2.on('finish', function () {
      t.pass('got dWebPeer2 "finish"')
      t.ok(dWebPeer2._writableState.finished)
    })
    dWebPeer2.on('end', function () {
      t.pass('got dWebPeer2 "end"')
      t.ok(dWebPeer2._readableState.ended)
    })

    str('abc').pipe(dWebPeer1)
  }
})
