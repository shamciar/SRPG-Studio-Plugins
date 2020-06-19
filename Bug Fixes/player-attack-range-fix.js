/**
 * Player attack range fix script.
 * No programming knowledge necessary.
 * Created by Balberith#3698.
 * If any issues are found with this script,
 * or you want to modify this script for compatability,
 * message me or notify in the SRPG Studio Discord
 *
 * Last Updated: 6/29/2020
 ** Updated to fix a bug that allowed unusable staves to display their range
 */

UnitRangePanel.getUnitAttackRange = function(unit) {
	var i, item, count, rangeMetrics;
	var startRange = 99;
	var endRange = 0;
	var obj = {};
	
	count = UnitItemControl.getPossessionItemCount(unit);
	for (i = 0; i < count; i++) {
		item = UnitItemControl.getItem(unit, i);
		rangeMetrics = this._getRangeMetricsFromItem(unit, item);
		if (rangeMetrics !== null) {
			if (rangeMetrics.startRange < startRange) {
				startRange = rangeMetrics.startRange;
			}
			if (rangeMetrics.endRange > endRange) {
				endRange = rangeMetrics.endRange;
			}
		}
	}
		
	obj.startRange = startRange;
	obj.endRange = endRange;
	obj.mov = this._getRangeMov(unit);
	
	return obj;
};

UnitRangePanel._getRangeMetricsFromItem = function(unit, item) {
	var rangeMetrics = null;
	
	if (item.isWeapon()) {
		if (ItemControl.isWeaponAvailable(unit, item)) {
			rangeMetrics = StructureBuilder.buildRangeMetrics();
			rangeMetrics.startRange = item.getStartRange();
			rangeMetrics.endRange = item.getEndRange();
		}
	}
	else {
		if (item.getRangeType() === SelectionRangeType.MULTI && (item.getFilterFlag() & UnitFilterFlag.ENEMY) && ItemControl.isItemUsable(unit, item)) {
			rangeMetrics = StructureBuilder.buildRangeMetrics();
			rangeMetrics.endRange = item.getRangeValue();
		}
	}
	
	return rangeMetrics;
};