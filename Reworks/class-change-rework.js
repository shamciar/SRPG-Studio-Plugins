/**
 * Removes Class Change limit and changes how class change works.
 * Basically, if you make promotion items and class change items separate,
 * and you disallow class change in the base,
 * this will allow you to use class promotion items to promote to
 * class group 1, and allow class change items to change to class group 2.
 * If a unit is unpromoted, they can use a promotion item to change to class group 1.
 * If a unit is promoted, they can use a class change item to class group 2.
 * Created by Balberith#3698
 */
 
/**
 * Function that removes the "maxClassUpCount" parameter.
 * Also changes the checks from a unit's amount of class changes
 * to whether or not the unit is of a promoted class.
 */
ClassChangeSelectManager._checkGroup = function(unit, item) {
	var i, count, classGroupId;
	var group = null;
	var info = item.getClassChangeInfo();
		
	if (DataConfig.isBattleSetupClassChangeAllowed()) {
		// If class can be changed in the SceneType.BATTLESETUP, class group 2 is used.
		classGroupId = unit.getClassGroupId2();
	}
	else {
		if (this._unit.getClass().getClassRank() === ClassRank.LOW) {
			// If class is unpromoted, class group 1 is used. 
			classGroupId = this._unit.getClassGroupId1();
		}
		else {
			// If class has been promoted, class group 2 is used.
			this._unit.setClassUpCount(1);
			classGroupId = this._unit.getClassGroupId2();
		}
	}
		
	// If id is -1, it means that this unit cannot change the class.
	if (classGroupId === -1) {
		this._infoWindow.setInfoMessage(StringTable.ClassChange_UnableClassChange);
		this.changeCycleMode(ClassChangeSelectMode.MSG);
		return null;
	}
		
	// Check if the unit's groupId is included.
	count = info.getClassGroupCount();
	for (i = 0; i < count; i++) {
		group = info.getClassGroupData(i);
		if (group.getId() === classGroupId) {
			break;
		}
	}
	
	// If groupId is not included, it means that the unit cannot change the class with the item.
	if (i === count) {
		this._infoWindow.setInfoMessage(StringTable.ClassChange_UnableClassChangeItem);
		this.changeCycleMode(ClassChangeSelectMode.MSG);
		return null;
	}
	
	return group;
}

ClassChangeItemUse._isChangeAllowed = function(itemTargetInfo) {
	var targetClass = itemTargetInfo.unit.getClass();
	root.log(targetClass.getName());
	root.log(targetClass);
	if (itemTargetInfo.targetClass === null) {
		return false;
	}
	
	return true;
}