/**
 * @file MetaDataBundle.d.ts
 *
 * Copyright (c) 2013 Williams Interactive, LLC. All Rights Reserved.
 */

declare module zeus
{
    /**
     * This class will be populated bundletime by the bundle server
     */
    export class MetaDataBundle
    {
        ///<meta tag="webaudio"/>
        public getWebaudio(): boolean;

        ///<meta tag="resourceversion"/> 
        public getResourceVersion(): string;

        ///<meta tag="minimumspintimemillis"/> 
        public getMinimumSpinTimeMillis(): number;

        ///<meta tag="gaffingenabled"/> 
        public isGaffingEnabled(): boolean;

        ///<meta tag="demoenabled"/> 
        public isDemoEnabled(): boolean;

        ///<meta tag="debugenabled"/> 
        public isDebugEnabled(): boolean;

        ///<meta tag="touchdevice"/>
        public isTouchDevice(): boolean;
        
        ///<meta tag="proxyserverurl"/>
        public getProxyServerUrl(): string;

        ///<meta tag="locale"/>
        public getLocale(): string;
    }
}
