/**
 * Dynamic magic ranges script.
 * No programming knowledge necessary.
 * Created by Balberith#3698.
 * If any issues are found with this script,
 * or you want to modify this script for compatability,
 * message me or notify in the SRPG Studio Discord.
 *
 * In order to make use of this script, you will
 * need to give a custom parameter to either a magic tome
 * or a staff with the "specify" range.
 * The custom parameter must be called "rangeMag", and it
 * should be set to the value you want to multiply a
 * unit's magic by to get the magic or staff range.
 * For example, putting {rangeMag:3} in a tome's custom parameter
 * section will cause its range to end at the equipping unit's magic * 3
 *
 * This plugin may not work if you have other scripts that alter attack ranges.
 * If this happens, you need to find which plugins cause the clash,
 * and extract and merge the conflicting functions into one file.
 * If you need assistance, feel free to notify me on Discord.
 *
 */

/**
 * This function sets the minimum and maximum range
 * for attacks and returns the maximum 
 */
IndexArray.createMagicIndexArray = function(x, y, item, unit) {
	var i, rangeValue, rangeType, arr;
	var startRange = 1;
	var endRange = 1;
	var count = 1;
	
	if (item === null) {
		startRange = 1;
		endRange = 1;
	}
	else if (item.isWeapon()) { //Item is weapon
		//Check if the item is magic and has the proper parameter
		if(item.getWeaponCategoryType() === WeaponCategoryType.MAGIC && typeof item.custom.rangeMag === 'number') {
			startRange = item.getStartRange();
			endRange = RealBonus.getMag(unit) * item.custom.rangeMag;
		} else {
			startRange = item.getStartRange();
			endRange = item.getEndRange();
		}
	}
	else {
		if (item.getItemType() === ItemType.TELEPORTATION && item.getRangeType() === SelectionRangeType.SELFONLY) {
			rangeValue = item.getTeleportationInfo().getRangeValue();
			rangeType = item.getTeleportationInfo().getRangeType();
		}
		else {
			rangeValue = item.getRangeValue();
			rangeType = item.getRangeType();
		}
		
		//Here is where we check if it is a staff with the proper custom parameter
		if(item.isWand() && typeof item.custom.rangeMag === 'number') {
			endRange = RealBonus.getMag(unit) * item.custom.rangeMag;
		}
		else if (rangeType === SelectionRangeType.SELFONLY) {
			return [];
		}
		else if (rangeType === SelectionRangeType.MULTI) {
			endRange = rangeValue;
		}
		else if (rangeType === SelectionRangeType.ALL) {
			count = CurrentMap.getSize();
			
			arr = [];
			arr.length = count;
			for (i = 0; i < count; i++) {
					arr[i] = i;
			}
			
			return arr;
		}
	}
	
	if(endRange < startRange) {
		endRange = startRange;
	}
	
	root.log("End Range: " + endRange);
	
	return this.getBestIndexArray(x, y, startRange, endRange);
	
};

BaseItemSelection.setUnitSelection = function() {
	var filter = this.getUnitFilter();
	var indexArray = IndexArray.createMagicIndexArray(this._unit.getMapX(), this._unit.getMapY(), this._item, this._unit);
	
	indexArray = this._getUnitOnlyIndexArray(this._unit, indexArray);
	this._posSelector.setUnitOnly(this._unit, this._item, indexArray, PosMenuType.Item, filter);
	
	this.setFirstPos();
};

// It's called if the item is used at the specific position.
BaseItemSelection.setPosSelection = function() {
	var indexArray = IndexArray.createMagicIndexArray(this._unit.getMapX(), this._unit.getMapY(), this._item, this._unit);
	
	this._posSelector.setPosOnly(this._unit, this._item, indexArray, PosMenuType.Item);
	
	this.setFirstPos();
};

BaseItemAvailability._checkMulti = function(unit, item) {
	var i, index, x, y;
	var indexArray = IndexArray.createMagicIndexArray(unit.getMapX(), unit.getMapY(), item, unit);
	var count = indexArray.length;
	
	for (i = 0; i < count; i++) {
		index = indexArray[i];
		x = CurrentMap.getX(index);
		y = CurrentMap.getY(index);
		if (this.isPosEnabled(unit, item, x, y)) {
			return true;
		}
	}
		
	return false;
};

AttackChecker.getAttackIndexArray = function(unit, weapon, isSingleCheck) {
    var i, index, x, y, targetUnit;
    var indexArrayNew = [];
    var indexArray = IndexArray.createMagicIndexArray(unit.getMapX(), unit.getMapY(), weapon, unit);
    var count = indexArray.length;
	
    for (i = 0; i < count; i++) {
        index = indexArray[i];
        x = CurrentMap.getX(index);
        y = CurrentMap.getY(index);
        targetUnit = PosChecker.getUnitFromPos(x, y);
        if (targetUnit !== null && unit !== targetUnit) {
            if (FilterControl.isReverseUnitTypeAllowed(unit, targetUnit)) {
                indexArrayNew.push(index);
                if (isSingleCheck) {
                    return indexArrayNew;
                }
            }
        }
    }
    
    return indexArrayNew;
};

AttackChecker.getFusionAttackIndexArray = function(unit, weapon, fusionData) {
    var i, index, x, y, targetUnit;
    var indexArrayNew = [];
    var indexArray = IndexArray.createMagicIndexArray(unit.getMapX(), unit.getMapY(), weapon, unit);
    var count = indexArray.length;
    
    for (i = 0; i < count; i++) {
        index = indexArray[i];
        x = CurrentMap.getX(index);
        y = CurrentMap.getY(index);
        targetUnit = PosChecker.getUnitFromPos(x, y);
        if (targetUnit !== null && unit !== targetUnit) {
            if (FusionControl.isAttackable(unit, targetUnit, fusionData) && FusionControl.isRangeAllowed(unit, targetUnit, fusionData)) {
                indexArrayNew.push(index);
            }
        }
    }
    
    return indexArrayNew;
};

// Check if the targetUnit can counterattack the unit.
AttackChecker.isCounterattack = function(unit, targetUnit) {
	var weapon, indexArray;
		
	if (!Calculator.isCounterattackAllowed(unit, targetUnit)) {
		return false;
	}
		
	weapon = ItemControl.getEquippedWeapon(unit);
	if (weapon !== null && weapon.isOneSide()) {
		// If the attacker is equipped with "One Way" weapon, no counterattack occurs.
		return false;
	}
		
	// Get the equipped weapon of those who is attacked.
	weapon = ItemControl.getEquippedWeapon(targetUnit);
	
	// If no weapon is equipped, cannot counterattack.
	if (weapon === null) {
		return false;
	}
		
	// If "One Way" weapon is equipped, cannot counterattack.
	if (weapon.isOneSide()) {
		return false;
	}
		
	indexArray = IndexArray.createMagicIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), weapon, targetUnit);

	return IndexArray.findUnit(indexArray, unit);
};

AttackChecker.isCounterattackPos = function(unit, targetUnit, x, y) {
    var indexArray;
    var weapon = ItemControl.getEquippedWeapon(targetUnit);
    
    if (weapon === null) {
        return false;
    }
    
    indexArray = IndexArray.createMagicIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), weapon, targetUnit);
    
    return IndexArray.findPos(indexArray, x, y);
};

//For displaying the new attack range in the weapon item description
ItemSentence.CriticalAndRange._drawRange = function(x, y, item) {
	var startRange = item.getStartRange();
	var endRange = item.getEndRange();
	var textui = root.queryTextUI('default_window');
	var color = textui.getColor();
	var font = textui.getFont();
	
	var num = item.custom.rangeMag;
	var ch;
	
	if(typeof num === 'number') {
		if(num < 1) {
			ch = "/"
			num = 1/num;
		}
		else {
			ch = "*";
		}
		NumberRenderer.drawRightNumber(x, y, startRange);
		TextRenderer.drawKeywordText(x + 8, y, StringTable.SignWord_WaveDash, -1, color, font);
		TextRenderer.drawKeywordText(x + 14, y, "Mag" + ch + num, -1, color, font);
	} else if (startRange === endRange) {
		NumberRenderer.drawRightNumber(x, y, startRange);
	}
	else {
		NumberRenderer.drawRightNumber(x, y, startRange);
		TextRenderer.drawKeywordText(x + 17, y, StringTable.SignWord_WaveDash, -1, color, font);
		NumberRenderer.drawRightNumber(x + 40, y, endRange);
	}
};

//For displaying the new range in the staff item description
BaseItemInfo.drawRange = function(x, y, rangeValue, rangeType) {
	var textui = this.getWindowTextUI();
	var color = textui.getColor();
	var font = textui.getFont();
		
	ItemInfoRenderer.drawKeyword(x, y, root.queryCommand('range_capacity'));
	x += ItemInfoRenderer.getSpaceX();
	
	if(this._item.isWand() && typeof this._item.custom.rangeMag === 'number') {
		var num = this._item.custom.rangeMag;
		var ch;
		if(num < 1) {
			ch = "/"
			num = 1/num;
		}
		else {
			ch = "*";
		}
		TextRenderer.drawKeywordText(x, y, "Mag" + ch + num, -1, color, font);
	}
	else if (rangeType === SelectionRangeType.SELFONLY) {
		TextRenderer.drawKeywordText(x, y, StringTable.Range_Self, -1, color, font);
	}
	else if (rangeType === SelectionRangeType.MULTI) {
		NumberRenderer.drawRightNumber(x, y, rangeValue);
	}
	else if (rangeType === SelectionRangeType.ALL) {
		TextRenderer.drawKeywordText(x, y, StringTable.Range_All, -1, color, font);
	} 
	else {
		TextRenderer.drawKeywordText(x, y, rangeValue, -1, color, font);
	}
};

//For displaying the new attack range on the map
UnitRangePanel._getRangeMetricsFromItem = function(unit, item) {
	var rangeMetrics = null;
	
	if (item.isWeapon()) {
		if (ItemControl.isWeaponAvailable(unit, item)) {
			if(item.getWeaponCategoryType() === WeaponCategoryType.MAGIC && typeof item.custom.rangeMag === 'number') {
				rangeMetrics = StructureBuilder.buildRangeMetrics();
				rangeMetrics.startRange = item.getStartRange();
				rangeMetrics.endRange = (RealBonus.getMag(unit) * item.custom.rangeMag);
			} else {
				rangeMetrics = StructureBuilder.buildRangeMetrics();
				rangeMetrics.startRange = item.getStartRange();
				rangeMetrics.endRange = item.getEndRange();
			}
		}
	}
	else {
		if (item.getRangeType() === SelectionRangeType.MULTI && (item.getFilterFlag() & UnitFilterFlag.ENEMY)) {
			if(item.isWand() && typeof item.custom.rangeMag === 'number') {
				rangeMetrics = StructureBuilder.buildRangeMetrics();
				rangeMetrics.endRange = (RealBonus.getMag(unit) * item.custom.rangeMag);
			} else {
				rangeMetrics = StructureBuilder.buildRangeMetrics();
				rangeMetrics.endRange = item.getRangeValue();
			}
		}
	}
	
	return rangeMetrics;
};
	
CombinationCollector.Weapon.collectCombination = function(misc) {
    var i, weapon, filter, rangeMetrics;
    var unit = misc.unit;
    var itemCount = UnitItemControl.getPossessionItemCount(unit);
    
    for (i = 0; i < itemCount; i++) {
        weapon = UnitItemControl.getItem(unit, i);
        if (weapon === null) {
            continue;
        }
        
          // If it's not a weapon, or cannot equip with a weapon, don't continue.
        if (!weapon.isWeapon() || !this._isWeaponEnabled(unit, weapon, misc)) {
            continue;
        }
        
        misc.item = weapon;
        
        rangeMetrics = StructureBuilder.buildRangeMetrics();
        rangeMetrics.startRange = weapon.getStartRange();
        rangeMetrics.endRange = weapon.getEndRange();
		
		if(weapon.getWeaponCategoryType() === WeaponCategoryType.MAGIC && typeof weapon.custom.rangeMag === 'number') {
			rangeMetrics.endRange = (RealBonus.getMag(unit) * weapon.custom.rangeMag);
		}
        
        filter = this._getWeaponFilter(unit);
        this._checkSimulator(misc);
        this._setUnitRangeCombination(misc, filter, rangeMetrics);
		
        
        filter = this._getWeaponFilter(unit);
        this._checkSimulator(misc);
        this._setUnitRangeCombination(misc, filter, rangeMetrics);
    }
};

CombinationCollector.Item._setUnitCombination = function(misc) {
	var filter, rangeValue, rangeType, rangeMetrics;
	var unit = misc.unit;
	var item = misc.item;
	var obj = ItemPackageControl.getItemAIObject(item);
		
	if (obj === null) {
		return;
	}
		
	filter = obj.getUnitFilter(unit, item);
	
	if (item.getItemType() === ItemType.TELEPORTATION && item.getRangeType() === SelectionRangeType.SELFONLY) {
		rangeValue = item.getTeleportationInfo().getRangeValue();
		rangeType = item.getTeleportationInfo().getRangeType();
	}
	else {
		rangeValue = item.getRangeValue();
		rangeType = item.getRangeType();
	}
	
	rangeMetrics = StructureBuilder.buildRangeMetrics();
	rangeMetrics.endRange = rangeValue;
	if(item.isWand() && typeof item.custom.rangeMag === 'number') {
		rangeMetrics.endRange = (RealBonus.getMag(unit) * item.custom.rangeMag);
	}
	rangeMetrics.rangeType = rangeType;
			
	this._setUnitRangeCombination(misc, filter, rangeMetrics);
};
