/**
 * @file LocalizationBundle.ts
 *
 * Copyright (c) 2013 Williams Interactive, LLC. All Rights Reserved.
 */

declare module zeus
{
    /**
     * Contains all the localized strings.
     * This class will be populated bundletime by the bundle server.
     */
    export class LocalizationBundle
    {
        ///<localization tag="mobile/com.williamsinteractive.mobile.mobile.touch_to_start"/>
        public getClickToStartFeature(): string;

        ///<localization tag="framework/com.wms.framework.paytable.wincap"/>
        public getPaytableWincap(wincap:string): string;

        ///<localization tag="framework/com.wms.framework.paytable.returntoplayer"/>
        public getPaytableReturnToPlayer(percentage:string): string;

        ///<localization tag="zeus/com.wms.framework.msgbar.zerovaluescatterpay"/>
        public getZeroValueScatterPay(): string;

        ///<localization tag="freespin/com.wms.freespin.remainingtext"/>
        public getRemainingText(): string;

        ///<localization tag="framework/com.wms.framework.msgbar.featurepay"/>
        public getFeaturePay(value: string): string;

        ///<localization tag="framework/com.wms.framework.msgbar.linepay"/>
        public getLinePay(line: string, pay: string): string;

        ///<localization tag="freespin/com.wms.freespin.retrigger"/>
        public getRetrigger(): string;
        
        ///<localization tag="freespin/com.wms.freespin.totalwin"/>
        public getTotalWin(): string;
       
        ///<localization tag="framework/com.wms.framework.rules.basegameheader"/>
        public getHelpBasegameHeader(): string;

        ///<localization tag="framework/com.wms.framework.rules.featuredescriptionheader"/>
        public getHelpFeatureDescriptionHeader(): string;

        ///<localization tag="framework/com.wms.framework.paytable.paylinesheader"/>
        public getHelpPaylinesHeader(): string;

        ///<localization tag="framework/com.wms.framework.paytable.payreflectsbet"/>
        public getHelpPayReflectsBet(): string;

        ///<localization tag="framework/com.wms.framework.paytable.highestwinnerpaid"/>
        public getHelpHighestWinnerPaid(): string;

        ///<localization tag="framework/com.wms.framework.paytable.leftmostadjacentpaylines"/>
        public getHelpLeftMostAdjacentPaylines(): string;

        ///<localization tag="framework/com.wms.framework.paytable.paylinesadded"/>
        public getHelpPaylinesAdded(): string;

        ///<localization tag="framework/com.wms.framework.paytable.totalbetlinestimesbet"/>
        public getHelpTotalBetLinesTimesBet(): string;

        ///<localization tag="framework/com.wms.framework.paytable.activepaylineswin"/>
        public getHelpActivatePaylinesWin(): string;

        ///<localization tag="framework/com.wms.framework.paytable.followinglinescontribute"/>
        public getHelpFollowingLinesContribute(): string;

        ///<localization tag="framework/com.wms.framework.paytable.anyoralllines"/>
        public getHelpAnyOrAllLines(): string;

        ///<localization tag="framework/com.wms.framework.paytable.totalbetdividedequally"/>
        public getHelpTotalBetDividedEqually(): string;

        ///<localization tag="framework/com.wms.framework.paytable.malfunctiondisclaimer"/>
        public getHelpMalfunctionDisclaimer(): string;

        ///<localization tag="freespin/com.wms.freespin.alternatereelsidenticalcombos"/>
        public getHelpAlternateReelsIdenticalCombos(): string;

        ///<localization tag="freespin/com.wms.freespin.samebetandpaylines"/>
        public getHelpSameBetAndPaylines(): string;

        ///<localization tag="zeus/com.wms.zeus.rules.featuretrigger"/>
        public getHelpFeatureTrigger(): string;

        ///<localization tag="zeus/com.wms.zeus.rules.freespinsaward"/>
        public getHelpFreeSpinsAward(): string;

        ///<localization tag="zeus/com.wms.zeus.rules.freespinsaward100"/>
        public getHelpFreeSpinsAward100(): string;

        ///<localization tag="zeus/com.wms.zeus.rules.freespinsaward25"/>
        public getHelpFreeSpinsAward25(): string;

        ///<localization tag="zeus/com.wms.zeus.rules.freespinsaward10"/>
        public getHelpFreeSpinsAward10(): string;

        ///<localization tag="zeus/com.wms.zeus.rules.startfeature"/>
        public getHelpStartFeature(): string;

        ///<localization tag="zeus/com.wms.zeus.rules.retrigger"/>
        public getHelpRetrigger(): string;

        ///<localization tag="zeus/com.wms.zeus.rules.wild"/>
        public getHelpWild(): string;

        ///<localization tag="zeus/com.wms.zeus.freespinsawarded"/> 
        public getFreespinsAwarded(numberOfFreespins: string): string;

        ///<localization tag="framework/com.wms.framework.help.allrightsreserved"/>
        public getAllRightsReserved(): string;

        ///<localization tag="framework/com.wms.framework.anim.bigwin"/>
        public getBigWin(): string;

        ///<localization tag="framework/com.wms.framework.anim.superbigwin"/>
        public getSuperWin(): string;

        ///<localization tag="framework/com.wms.framework.anim.megabigwin"/>
        public getMegaWin(): string;

        ///<localization tag="framework/com.wms.framework.msgbar.detailedbetformula"/>
        public getBetFormula(unknown: string, betPerLine: string, uknown2: string, totalBet:string, numberOfLines:string): string;

        ///<localization tag="mobile/com.williamsinteractive.mobile.mobile.downloading"/>
        public getDownloading(): string;

        ///<localization tag="framework/com.wms.framework.dash.spin"/>
        public getSpin(): string;

        ///<localization tag="framework/com.wms.framework.dash.win"/>
        public getWin(): string;
    }
}
