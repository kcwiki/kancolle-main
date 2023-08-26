const { equal } = require('assert')

const main = require('../dist/main')

const r = new main.ShipUpgradeModelHolder()

equal(r._getRequiredDevkitNum(129, 1, 2000), 0)
equal(r._getRequiredDevkitNum(503, 1, 4700), 10)
equal(r._getRequiredDevkitNum(508, 0, 4500), 10)
equal(r._getRequiredDevkitNum(610), 84)
equal(r._getRequiredBuildKitNum(129), 0)
equal(r._getRequiredBuildKitNum(503), 20)
equal(r._getRequiredBuildKitNum(508), 20)
equal(r._getRequiredBuildKitNum(610), 84)
equal(main.PlaneConst.getEnemyPlaneGraphicsType(1610), 18)
equal(main.ITEMUP_REPLACE[1610], 1610)
equal(main.SuffixUtil.create(156, 'ship_card'), '6982')
