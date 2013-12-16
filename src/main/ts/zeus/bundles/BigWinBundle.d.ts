/**
 * @file BigWinBundle.d.ts
 *
 * Copyright (c) 2013 Williams Interactive, LLC. All Rights Reserved.
 */

declare module zeus
{
    export class BigWinBundle extends assetmanager.AbstractResourceBundle
    {
        ///<asset path="images/bigwin.png"/>
        public getBigWinHotDog(): assetmanager.IImageAsset;

        ///<asset path="images/super_bigwin.png"/>
        public getSuperBigWinHotDog(): assetmanager.IImageAsset;

        ///<asset path="images/mega_bigwin.png"/>
        public getMegaBigWinHotDog(): assetmanager.IImageAsset;

        ///<asset path="images/big_win_txt.png"/>
        public getBigWinText(): assetmanager.IImageAsset;

        ///<asset path="images/big_win_stars.png"/>
        public getBigWinStars(): assetmanager.IImageAsset;

        ///<asset path="bigwin_coin/coin.atlas"/>
        public getBigWinCoin(): assetmanager.ITextureAtlasAsset;

        ///<asset path="bigwin_diamond/diamond.atlas"/>
        public getBigWinDiamond(): assetmanager.ITextureAtlasAsset;                

        ///<asset path="bigwin_emerald/emerald.atlas"/>
        public getBigWinEmerald(): assetmanager.ITextureAtlasAsset;
    }
}
