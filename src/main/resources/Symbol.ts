module darkgame
{
	export class Symbol
	{
		//TODO: This should be an image instead of just a color
		private img:HTMLImageElement;
		private index:number;
		constructor(img:HTMLImageElement, index:number)
		{
			this.img = img;
			this.index = index;
		}

		public getIndex():number
		{
			return this.index;
		}

		public getImage():HTMLImageElement
		{
			return this.img;
		}
	}
}