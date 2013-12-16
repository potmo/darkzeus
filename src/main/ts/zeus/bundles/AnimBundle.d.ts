/**
 * @file AnimBundle.d.ts
 *
 * Copyright (c) 2013 Williams Interactive, LLC. All Rights Reserved.
 */

declare module zeus
{
    export class AnimBundle extends assetmanager.AbstractResourceBundle
    {
        ///<asset path="lightning_anim/lightning_anim.atlas"/>
        public getLightningAnim(): assetmanager.ITextureAtlasAsset;

        ///<asset path="wild_anim/wild_anim.atlas"/>
        public getWildAnim(): assetmanager.ITextureAtlasAsset;

        ///<asset path="zeus_anim/zeus_anim.atlas"/>
        public getZeusAnim(): assetmanager.ITextureAtlasAsset;

        ///<asset path="particles/sparkles.atlas"/>
        public getSparkles(): assetmanager.ITextureAtlasAsset;

        ///<asset path="particles/color_sparkles.atlas"/>
        public getColorSparkles(): assetmanager.ITextureAtlasAsset;

        ///<asset path="anticipation/anticipation.atlas"/>
        public getAnticipation(): assetmanager.ITextureAtlasAsset;

        ///<asset path="highlights/highlights.atlas"/>
        public getSymbolHighlight(): assetmanager.ITextureAtlasAsset;
    }
}
