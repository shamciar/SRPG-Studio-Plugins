/**
 * Script for updating the battle calculations.
 * Created by Balberith#3698
 */
 
 /**
 * Changes the hit formula
 * From: skl * 3 + weapon hit
 * To: skl * 2 + weapon hit + luck
 */
AbilityCalculator.getHit= function(unit, weapon) {
	return (weapon.getHit() + (RealBonus.getSki(unit) * 2) + RealBonus.getLuk(unit));
 };
		
/**
 * Changes the avo formula
 * From: spd * 2
 * To: attack spd * 2 + luck
 */
 AbilityCalculator.getAvoid= function(unit) {
	var avoid, terrain;
	var cls = unit.getClass();
	
	avoid = ((AbilityCalculator.getAgility(unit, ItemControl.getEquippedWeapon(unit))) * 2 + RealBonus.getLuk(unit));
			
	// If class type gains terrain bonus, add the avoid rate of terrain.
	if (cls.getClassType().isTerrainBonusEnabled()) {
		terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
		if (terrain !== null) {
			avoid += terrain.getAvoid();
		}
	}	
	return avoid;
		
};
		
/**
 * Changes the crit avo formula
 * From: luck
 * To: luck * 2
 */
AbilityCalculator.getCriticalAvoid= function(unit) {
	return RealBonus.getLuk(unit) * 2;
};
		 
/**
 * Changes the total damage calculator
 * From: If weapon had effective bonus, total damage is multiplied by effective bonus
 * To: If weapon has effective bonus, weapon might is multiplied by effective bonus
 */
DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
	var pow = AbilityCalculator.getPower(active, weapon) + CompatibleCalculator.getPower(active, passive, weapon) + SupportCalculator.getPower(totalStatus);
		
	if (this.isEffective(active, passive, weapon, isCritical, trueHitValue)) {
		pow += (Math.floor(weapon.getPow() * (this.getEffectiveFactor() - 1)));
	}
		
	return pow;
};