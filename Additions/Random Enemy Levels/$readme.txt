Enemy Random Level Ups
By Balberith

This plugin causes enemies to randomly level up based on their class base stats.
Put this folder in the plugins folder of your SRPG project to make use of this
folder. If you use this plugin, you will not need to calculate or input stats
into the editor by hand, unless you want an enemy to have a definite stat boost.
Please note that using this plugin may cause your enemies to have
extremely varied stats, and can also lead them to be more powerful or
weaker than intended.

CUSTOM PARAMTERS
If you want to increase a specific enemy's growth rates by a certain amount,
use any of the following custom parameters
gMHP
gSTR
gMAG
gSKL
gSPD
gLCK
gDEF
gRES
gMOV
gCON
gWLV
For example, if you wanted to make it so that a certain enemy has 25%
higher strength growth and 10% higher defense growth, you would put
{
gSTR:25,
gDEF:10
}
in that enemy's custom parameter section

If you want to change enemy growth patterns based on difficulty,
you can use the following custom parameters in the difficulties
tab to overwrite values in the options and change experience.
gRESET; for level resets
gPROMO; for assumed promotion level
gLEVEL1; if counting level 1
gMOB; if you only want mobs to be randomly leveled and not bosses
gROLLS; number of times to roll for each level
gRAND; to use random level ups
gMIN; to set a minimum bound
gMAX; to set a maximum bound
gAVG; to use average level ups

For example, if you wanted to make it so that stats reach a minimum level,
you would put
{
gMIN:true
}
in the difficulty's custom parameter section.

OPTIONS
In the random-enemy-level-options, you can change variables to change how
enemies grow. You do not need to change anything else in either script
for it to work properly.

OTHER OPTIONS
If you do not want certain values to randomly grow, you can simply
set the growth value in the editor to 0. However, if you want to
improve performance, you can also comment out those stats
from being calculated. You'll need to do this in 6 separate locations:
1. Lines 139 - 149
2. Lines 156 - 166
3. Lines 170 - 180
4. Lines 190 - 200
5. Lines 210 - 220
6. Lines 225 - 236

FURTHER CUSTOMIZATION:
In lines 190 - 200 and lines 210 - 220, different Math functions are used
to set the lower and upper stat bounds. You can change these to any of the
following to fit your customization better.
Math.round - rounds the stat to the closest integer
-Use if you want growth remainders 50% or higher to count as a level
Math.floor - always rounds down
-Use when you want to require a 100% growth to count as a level
Math.ceil - always rounds up
-Use when you want to let any growth remained above 0% to count as a level

Update History:
-4/28/2019: 
--First upload
-4/29/2019:
--Customization and options update
-5/1/2019:
--Fixed error that prevented reinforcements from receiving levels
--Fixed error that caused stats to be calculated only after pressing
"fight" and not during map preparation.

KNOWN ISSUES:
None