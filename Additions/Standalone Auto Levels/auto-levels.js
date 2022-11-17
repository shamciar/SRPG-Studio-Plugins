/**
 * Script automatically levels units up based on their growth rates.
 * This will take into account class AND unit growth rates.
 * To use this script, place it in your plugins folder.
 * Then, in a script where you want to auto level a unit,
 * call AutoLeveler.autoLevel(unit)
 * Created by Balberith#3698.
 * If any issues are found with this script,
 * or you want help adding your own functionality,
 * message me or notify in the SRPG Studio Discord
 */

AutoLeveler = {
	//Automatically set unit stats based on their class and unit growth data
	autoLevel: function(unit) {
		
		//Get unit's class, class base stats, and level
		var unitClass = unit.getClass();
		var classBase = unitClass.getPrototypeInfo().getInitialArray();
		var level = unit.getLv();
		var difficulty = root.getMetaSession().getDifficulty();
		
		//root.log(root.getScriptVersion());
		
		//Get units growth rates
		//Comment out stats that you don't want grow
		var MHPgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.MHP) + ParamGroup.getGrowthBonus(unit, ParamType.MHP);
		var STRgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.POW) + ParamGroup.getGrowthBonus(unit, ParamType.POW);
		var MAGgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.MAG) + ParamGroup.getGrowthBonus(unit, ParamType.MAG);
		var SKLgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.SKI) + ParamGroup.getGrowthBonus(unit, ParamType.SKI);
		var SPDgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.SPD) + ParamGroup.getGrowthBonus(unit, ParamType.SPD);
		var LCKgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.LUK) + ParamGroup.getGrowthBonus(unit, ParamType.LUK);
		var DEFgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.DEF) + ParamGroup.getGrowthBonus(unit, ParamType.DEF);
		var RESgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.MDF) + ParamGroup.getGrowthBonus(unit, ParamType.MDF);
		//var MOVgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.MOV)  + ParamGroup.getGrowthBonus(unit, ParamType.MOV);
		var CONgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.BLD)  + ParamGroup.getGrowthBonus(unit, ParamType.BLD);
		//var WLVgrowth = ParamGroup.getGrowthBonus(unitClass, ParamType.WLV)  + ParamGroup.getGrowthBonus(unit, ParamType.WLV);
		
		//Automatically level up each stat
		var mhp = 0, str = 0, mag = 0, skl = 0, spd = 0, lck = 0, def = 0, res = 0, mov = 0, con = 0, wlv = 0;
		var i = 0;
		var hp = unit.getHp();
		
		//Calculate stats based on averages
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
		
		
		unit.setParamValue(ParamType.MHP, mhp + unit.getParamValue(ParamType.MHP));
		unit.setHP(mhp + hp);
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
		
		// Amount of rolls for each level up.
		var rolls = 2;
		
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