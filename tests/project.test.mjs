import test from 'node:test';import assert from 'node:assert/strict';
import {ratioWeights} from '../src/features/ratio/model.js';
import {parseRoute} from '../src/core/router.js';
import {createEventBus} from '../src/core/event-bus.js';
import {easing} from '../src/core/animation.js';
import fa from '../src/i18n/fa.js';

test('normalized 50/50 balance',()=>assert.deepEqual(ratioWeights(0),{gold:50,silver:50,move:0}));
test('relative SLV rise reduces GLD value weight',()=>{const v=ratioWeights(40);assert.equal(v.gold,41.7);assert.equal(v.silver,58.3)});
test('relative SLV decline raises GLD value weight',()=>{const v=ratioWeights(-40);assert.equal(v.gold,62.5);assert.equal(v.silver,37.5)});
test('clamps non-financial demonstration to supported range',()=>assert.equal(ratioWeights(999).move,40));
test('parses story chapters and rejects unknown routes',()=>{assert.deepEqual(parseRoute('#/story/ownership'),{view:'story',chapter:'ownership'});assert.equal(parseRoute('#/story/secret').chapter,'top');assert.equal(parseRoute('#ownership').chapter,'ownership')});
test('studio route is distinct',()=>assert.deepEqual(parseRoute('#/studio'),{view:'studio'}));
test('event bus unsubscribe works',()=>{const b=createEventBus();let count=0;const off=b.on('x',()=>count++);b.emit('x');off();b.emit('x');assert.equal(count,1)});
test('easing functions have correct endpoints',()=>{for(const fn of Object.values(easing)){assert.ok(Math.abs(fn(0))<1e-9);assert.ok(Math.abs(fn(1)-1)<1e-9)}});
test('bilingual core content and risk copy present',()=>{for(const key of ['heroA','riskMarketD','studioIntro','ratioNote','closingLegal'])assert.ok(fa[key]?.length>2)});
