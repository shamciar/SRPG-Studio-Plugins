/**
 * Options for the random level up script.
 * No programming knowledge necessary.
 * Created by Balberith#3698.
 * If any issues are found with this script,
 * message me or notify in the SRPG Studio Discord
 */

/**
 * This is for levelling specifics
 * LV_RESET:
 *  If you set levels to reset upon class change, set LV_RESET to true
 *  Otherwise, set it to false
 * PROMO_LVL:
 *  Set PROMO_LVL to the amount of levels you want promoted units to start at
 *  This only works if LV_RESET is true
 * LEVEL_1:
 *  Set COUNT_FIRST to true if you want level 1 to recieve a level up
 *  Otherwise set it to false.
 * MOB_ONLY:
 *  If you do not want boss or sub boss units to randomly level up, set MOB_ONLY to true.
 *  Otherwise, set it to false.
 * NUM_ROLLS:
 *  If you want to give enemies more chances to gain a stat point for each level,
 *  set NUM_ROLLS to that number.
 *  Higher numbers means enemies will have higher stats, but it will also make
 *  their stats more consistent.
 * FULL_RAND:
 *  If you want levels to be fully random, set this to true.
 *  Be aware that this is the least stable way of levelling enemies,
 *  but is the most truly random
 * MIN_LIMIT:
 *  If you want enemies to have a lower bound on how low their stats
 *  can be when using FULL_RAND, set this to true.
 *  The minimum bound is based on the unit's growths.
 *  This method contains randomness, but prevents enemies from being
 *  negatively affected by bad level ups.
 * MAX_LIMIT:
 *  If you want enemies to have an upper bound on how high their stats
 *  can be when using FULL_RAND, set this to true.
 *  The maximum bound is based on the unit's growths.
 *  This method contains randomness, but prevents enemies from having
 *  ludicrously high stats.
 * NOTE: if you want to have both the effects MAX_LIMIT and MIN_LIMIT,
 * then use the AVERAGE tag.
 * AVERAGE:
 *  If you don't want levels to be random, but rather calculated,
 *  set this to true. The only randomness in play will come in the
 *  final level, causing minimal stat variance,
 *  This is the least random and least variable method.
 *  NOTE: If you use this method, set FULL_RAND, MAX_LIMIT, and MIN_LIMIT
 *  to false, as they will become redundant.
 */
var LV_RESET = false;
var PROMO_LVL = 0;
var LEVEL_1 = true;
var MOB_ONLY = false;
var NUM_ROLLS = 2;
var FULL_RAND = false;
var MIN_LIMIT = false;
var MAX_LIMIT = false;
var AVERAGE = true;