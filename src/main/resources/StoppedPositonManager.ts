module darkgame
{
	export class StoppedPositionManager implements darkgame.IPositionManager
	{
		private atPosition: number;
		private done:boolean;
		private doneCallback:(position: number, timestamp:number)=>void;

		constructor()
		{

		}

		public start(atPosition: number):void
		{
			console.log("starting stopped");

			this.atPosition = atPosition;
			this.done = false;
		}

		public stop(doneCallback:(position: number, timestamp:number)=>void):void
		{
			this.doneCallback = doneCallback;
			this.done = true;

			
		}

		public getPosition(currentTime:number):number
		{
			return this.atPosition;
		}

		public getVelocity(currentTime:number):number
		{
			return 0.0;
		}

		public tick(currentTime:number)
		{
			if (this.done)
			{
				this.doneCallback(this.getPosition(currentTime), currentTime);
			}
		}
	}
}