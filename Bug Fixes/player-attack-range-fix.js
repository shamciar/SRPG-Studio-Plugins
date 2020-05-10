/**
 * Player attack range fix script.
 * No programming knowledge necessary.
 * Created by Balberith#3698.
 * If any issues are found with this script,
 * or you want to modify this script for compatability,
 * message me or notify in the SRPG Studio Discord
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