/**
 * Script that causes enemies to randomly level up based on their class growth data.
 * Some values can be changed for further customiztion.
 * Custom parameters may be added to unit data to boost growth rates.
 * See the readme for more information.
 * Created by Balberith#3698.
 * If any issues are found with this script,
 * or you want help adding your own functionality,
 * message me or notify in the SRPG Studio Discord
 */

ReinforcementChecker._appearUnit = function(pageData, x, y) {
	var unit;
	var list = EnemyList.getAliveList();
	var mobonly = MOB_ONLY || root.getMetaSession().getDifficulty().custom.gMOB;
	
	if (list.getCount() >= DataConfig.getMaxAppearUnitCount()) {
		// Don't appear by exceeding "Max Map Enemy".
		return null;
	}
	
	// It means that the unit has appeared with this following method.
	unit = root.getObjectGenerator().generateUnitFromRefinforcementPage(pageData);
	if (unit !== null) {
		unit.setMapX(x);
		unit.setMapY(y);
		
		if (!mobonly || unit.getImportance() === ImportanceType.MOB) {
            EnemyLeveler.setEnemyStats(unit);
        }
		
		UnitProvider.setupFirstUnit(unit);
	}
	
	return unit;
},

/** Commented out due to redundancy; left because it works in the case that the following method fails
MapEdit.openMapEdit = function() {
	this._prepareMemberData();
	this._completeMemberData();
	
	var mobonly = MOB_ONLY || root.getMetaSession().getDifficulty().custom.gMOB;
	
	//Check if it is the first turn
	var begin = root.getCurrentSession().getTurnCount() == 1;
	if(begin) {
		//Get the list of enemies
		var enemyList = EnemyList.getAliveDefaultList();
		//Iterate through the list
		var i = 0;
		for(i = 0; i < enemyList.getCount(); i++) {
			if (!mobonly || enemyList.getData(i).getImportance() === ImportanceType.MOB) {
				//Level up each enemy
				EnemyLeveler.setEnemyStats(enemyList.getData(i));
            }
		}
	}
},
*/

OpeningEventFlowEntry._checkUnitParameter = function() {
	var i, j, list, unit, listCount, count;
	var listArray = FilterControl.getAliveListArray(UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY);
	var mobonly = MOB_ONLY || root.getMetaSession().getDifficulty().custom.gMOB;
	
	listCount = listArray.length;
	for (i = 0; i < listCount; i++) {
		list = listArray[i];
		count = list.getCount();
		for (j = 0; j < count; j++) {
			unit = list.getData(j);
			this._resetUnit(unit);
		}
	}
	
	//Randomly Level up enemies
	var enemyList = EnemyList.getAliveDefaultList();
	var mobonly = MOB_ONLY || root.getMetaSession().getDifficulty().custom.gMOB;
	//Iterate through the list
	for(i = 0; i < enemyList.getCount(); i++) {
		if (!mobonly || enemyList.getData(i).getImportance() === ImportanceType.MOB) {
			//Level up each enemy
			EnemyLeveler.setEnemyStats(enemyList.getData(i));
           }
	}
	
	
	list = root.getCurrentSession().getGuestList();
	count = list.getCount();
	for (j = 0; j < count; j++) {
		unit = list.getData(j);
		this._resetUnit(unit);
	}
},

EnemyLeveler = {
	//Randomly set enemy stats based on their class and unit growth data
	setEnemyStats: function(unit) {
		
		//Get unit's class, class base stats, and level
		var unitClass = unit.getClass();
		var classBase = unitClass.getPrototypeInfo().getInitialArray();
		var level = unit.getLv();
		var unitCustom = unit.custom;
		var difficulty = root.getMetaSession().getDifficulty();
		
		//Combine the difficulty custom variables with the default ones
		var lvreset = LV_RESET || difficulty.custom.gRESET;
		var promolvl = PROMO_LVL;
		var level1 = LEVEL_1 || difficulty.custom.gLEVEL1;
		var randlevel = FULL_RAND || difficulty.custom.gRAND;
		var minbound = MIN_LIMIT || difficulty.custom.gMIN;
		var maxbound = MAX_LIMIT || difficulty.custom.gMAX;
		var avglevel = AVERAGE || difficulty.custom.gAVG;
		
		//Error Check
		if(minbound && maxbound) {
			randlevel = false;
			minbound = false;
			maxbound = false;
			avglevel = true;
		}
		
		if(typeof difficulty.custom.gPROMO === 'number') {
			promolvl = difficulty.custom.gPROMO;
		}
		
		
		if(lvreset && unitClass.getClassRank() === ClassRank.HIGH) {
			level += promolvl;
		}
		if(!level1) {
			level -= 1;
		}
		
		//Get units growth rates
		//Comment out stats that you don't want grow
		var MHPgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.MHP) + (unitCustom.gMHP!=null ? unitCustom.gMHP : 0);
		var STRgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.POW) + (unitCustom.gSTR!=null ? unitCustom.gSTR : 0);
		var MAGgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.MAG) + (unitCustom.gMAG!=null ? unitCustom.gMAG : 0);
		var SKLgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.SKI) + (unitCustom.gSKL!=null ? unitCustom.gSKL : 0);
		var SPDgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.SPD) + (unitCustom.gSPD!=null ? unitCustom.gSPD : 0);
		var LCKgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.LUK) + (unitCustom.gLCK!=null ? unitCustom.gLCK : 0);
		var DEFgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.DEF) + (unitCustom.gDEF!=null ? unitCustom.gDEF : 0);
		var RESgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.MDF) + (unitCustom.gRES!=null ? unitCustom.gRES : 0);
		//var MOVgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.MOV)  + (unitCustom.gMOV!=null ? unitCustom.gMOV : 0);
		var CONgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.BLD)  + (unitCustom.gCON!=null ? unitCustom.gCON : 0);
		//var WLVgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.WLV)  + (unitCustom.gWLV!=null ? unitCustom.gWLV : 0);
		
		//Randomly level up each stat
		var mhp = 0, str = 0, mag = 0, skl = 0, spd = 0, lck = 0, def = 0, res = 0, mov = 0, con = 0, wlv = 0;
		var i = 0;
		var hp = unit.getHp();
		if(avglevel) { //Calculate stats based on averages
			mhp += Math.floor((level * MHPgrowth) / 100) + this._levelUp((level * MHPgrowth) % 100);
			str += Math.floor((level * STRgrowth) / 100) + this._levelUp((level * STRgrowth) % 100);
			mag += Math.floor((level * MAGgrowth) / 100) + this._levelUp((level * MAGgrowth) % 100);
			skl += Math.floor((level * SKLgrowth) / 100) + this._levelUp((level * SKLgrowth) % 100);
			spd += Math.floor((level * SPDgrowth) / 100) + this._levelUp((level * SPDgrowth) % 100);
			lck += Math.floor((level * LCKgrowth) / 100) + this._levelUp((level * LCKgrowth) % 100);
			def += Math.floor((level * DEFgrowth) / 100) + this._levelUp((level * DEFgrowth) % 100);
			res += Math.floor((level * RESgrowth) / 100) + this._levelUp((level * RESgrowth) % 100);
			//mov += Math.floor((level * MOVgrowth) / 100) + this._levelUp((level * MOVgrowth) % 100);
			con += Math.floor((level * CONgrowth) / 100) + this._levelUp((level * CONgrowth) % 100);
			//wlv += Math.floor((level * WLVgrowth) / 100) + this._levelUp((level * WLVgrowth) % 100);
		}
		else { //Calculate stats randomly
			for(i = 0; i < level; i++) {
				mhp += this._levelUp(MHPgrowth % 100) + Math.floor(MHPgrowth / 100);
				str += this._levelUp(STRgrowth % 100) + Math.floor(STRgrowth / 100);
				mag += this._levelUp(MAGgrowth % 100) + Math.floor(MAGgrowth / 100);
				skl += this._levelUp(SKLgrowth % 100) + Math.floor(SKLgrowth / 100);
				spd += this._levelUp(SPDgrowth % 100) + Math.floor(SPDgrowth / 100);
				lck += this._levelUp(LCKgrowth % 100) + Math.floor(LCKgrowth / 100);
				def += this._levelUp(DEFgrowth % 100) + Math.floor(DEFgrowth / 100);
				res += this._levelUp(RESgrowth % 100) + Math.floor(RESgrowth / 100);
				//mov += this._levelUp(MOVgrowth % 100) + Math.floor(MOVgrowth / 100);
				con += this._levelUp(CONgrowth % 100) + Math.floor(CONgrowth / 100);
				//wlv += this._levelUp(WLVgrowth % 100) + Math.floor(WLVgrowth / 100);
			}
			if(minbound) { //Set a minimum bound
				//If you want to further customize this function,
				//you can change the Math function that is called
				//Math.round rounds the number up if the remainder
				//is 50 more higher, and down if the remainder
				//is 49 or lower.
				//Math.floor will always round down,
				//and Math.ceil will always round up
				mhp = Math.max(mhp, Math.floor((level * MHPgrowth) / 100));
				str = Math.max(str, Math.floor((level * STRgrowth) / 100));
				mag = Math.max(mag, Math.floor((level * MAGgrowth) / 100));
				skl = Math.max(skl, Math.floor((level * SKLgrowth) / 100));
				spd = Math.max(spd, Math.floor((level * SPDgrowth) / 100));
				lck = Math.max(lck, Math.floor((level * LCKgrowth) / 100));
				def = Math.max(def, Math.floor((level * DEFgrowth) / 100));
				res = Math.max(res, Math.floor((level * RESgrowth) / 100));
				//mov = Math.max(mov, Math.floor((level * MOVgrowth) / 100));
				con = Math.max(con, Math.floor((level * CONgrowth) / 100));
				//wlv = Math.max(wlv, Math.floor((level * WLVgrowth) / 100));
			}
			if(maxbound) { //Set a maximum bound
				//If you want to further customize this function,
				//you can change the Math function that is called
				//Math.round rounds the number up if the remainder
				//is 50 more higher, and down if the remainder
				//is 49 or lower.
				//Math.floor will always round down,
				//and Math.ceil will always round up
				mhp = Math.min(mhp, Math.ceil((level * MHPgrowth) / 100));
				str = Math.min(str, Math.ceil((level * STRgrowth) / 100));
				mag = Math.min(mag, Math.ceil((level * MAGgrowth) / 100));
				skl = Math.min(skl, Math.ceil((level * SKLgrowth) / 100));
				spd = Math.min(spd, Math.ceil((level * SPDgrowth) / 100));
				lck = Math.min(lck, Math.ceil((level * LCKgrowth) / 100));
				def = Math.min(def, Math.ceil((level * DEFgrowth) / 100));
				res = Math.min(res, Math.ceil((level * RESgrowth) / 100));
				//mov = Math.min(mov, Math.ceil((level * MOVgrowth) / 100));
				con = Math.min(con, Math.ceil((level * CONgrowth) / 100));
				//wlv = Math.min(wlv, Math.ceil((level * WLVgrowth) / 100));
			}
		}
		
		
		unit.setParamValue(ParamType.MHP, mhp + unit.getParamValue(ParamType.MHP) - 1);
		unit.setHP(mhp + hp - 1);
        unit.setParamValue(ParamType.POW, str + unit.getParamValue(ParamType.POW));
        unit.setParamValue(ParamType.MAG, mag + unit.getParamValue(ParamType.MAG));
        unit.setParamValue(ParamType.SKI, skl + unit.getParamValue(ParamType.SKI));
        unit.setParamValue(ParamType.SPD, spd + unit.getParamValue(ParamType.SPD));
        unit.setParamValue(ParamType.LUK, lck + unit.getParamValue(ParamType.LUK));
        unit.setParamValue(ParamType.DEF, def + unit.getParamValue(ParamType.DEF));
        unit.setParamValue(ParamType.MDF, res + unit.getParamValue(ParamType.MDF));
        //unit.setParamValue(ParamType.MOV, unit.getParamValue(ParamType.MOV));
        unit.setParamValue(ParamType.BLD, con + unit.getParamValue(ParamType.BLD));
        //unit.setParamValue(ParamType.WLV, wlv + unit.getParamValue(ParamType.WLV));
	},
	
	_levelUp: function(growth) {
		var up = false;
		
		var rolls = NUM_ROLLS;
		if(typeof root.getMetaSession().getDifficulty().gROLLS === 'number') {
			rolls = root.getMetaSession().getDifficulty().gROLLS;
		}
		
		var i = 0;
		var rand;
		for(i = 0; i < rolls; i++) {
			rand = Math.random() * 100;
			if(rand < growth) {
				up = true;
			}
		}
		return up;
	}
}