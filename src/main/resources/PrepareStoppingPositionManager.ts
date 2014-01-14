module darkgame
{
	export class PrepareStoppingPositionManager implements darkgame.IPositionManager
	{
		private fromPosition:number;
		private fromTime:number;
		private toPosition:number;
		private velocity:number;
		private doneCallback:(position: number, velocity:number, timestamp:number)=>void;
		
		constructor()
		{
		}

		public start(fromPosition: number, toPosition:number, fromTime:number, velocity:number, doneCallback:(position: number, velocity:number, timestamp:number)=>void):void
		{
			console.log("starting running");

			this.fromPosition = fromPosition;
			this.toPosition = toPosition;
			this.fromTime = fromTime;
			this.velocity = velocity;
			this.doneCallback = doneCallback;
		}

		public getPosition(currentTime:number):number
		{
			var timeDelta:number = currentTime - this.fromTime;
			var currentPositon:number = this.fromPosition + timeDelta * this.velocity;
			return Math.min(this.toPosition, currentPositon);
		}

		public getVelocity(currentTime:number):number
		{
			return this.velocity;
		}

		public tick(currentTime:number)
		{
			var currentPosition:number = this.getPosition(currentTime);

			if (this.toPosition <= currentPosition)
			{
				this.doneCallback(this.toPosition, this.velocity, currentTime);
			}
		}
	}
}