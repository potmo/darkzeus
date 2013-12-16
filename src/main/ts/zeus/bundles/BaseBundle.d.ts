/**
 * @file BaseBundle.d.ts
 *
 * Copyright (c) 2013 Williams Interactive, LLC. All Rights Reserved.
 */

declare module zeus
{
    export class BaseBundle extends assetmanager.AbstractResourceBundle
    {
        ///<asset path="fonts/myriadpro-black.otf"/>
        public getMyriadProBlack(): assetmanager.IFontAsset;

        ///<asset path="fonts/myriadpro-lightcond.otf"/>
        public getMyriadProLightCond(): assetmanager.IFontAsset;

        ///<asset path="fonts/myriadpro-semiboldcond.otf"/>
        public getMyriadProSemiBoldCond(): assetmanager.IFontAsset;

        ///<asset path="fonts/warnockpro-disp.otf"/>
        public getWarnockProDisp(): assetmanager.IFontAsset;

        ///<asset path="base_symbols/base_symbols.atlas"/>
        public getBaseSymbols(): assetmanager.ITextureAtlasAsset;

        ///<asset path="reel_frame/reel_frame.atlas"/>
        public getReelFrame(): assetmanager.ITextureAtlasAsset;

        ///<asset path="images/zeus_logo.png"/>
        public getLogo(): assetmanager.IImageAsset;

        ///<asset path="images/bangup.png"/>
        public getBangup(): assetmanager.IImageAsset;

        ///<asset path="images/base_bg.jpg"/>
        public getBaseBg(): assetmanager.IImageAsset;

         ///<asset path="images/ThirtyPaylines.png"/>
        public getPaylines(): assetmanager.IImageAsset;
    }
}
