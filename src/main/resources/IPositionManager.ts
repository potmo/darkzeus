module darkgame
{
	export interface IPositionManager
	{
		getVelocity(currentTime:number): number;
		getPosition(currentTime: number):number;
		tick(currentTime:number):void;
	}
}