// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {flakes} from '../models';

export function Create(arg1:string,arg2:any,arg3:number):Promise<flakes.Flake>;

export function DeleteById(arg1:number):Promise<void>;

export function GetAll():Promise<Array<flakes.Flake>>;

export function GetAllByBowlId(arg1:number):Promise<Array<flakes.Flake>>;

export function GetById(arg1:number):Promise<flakes.Flake>;

export function UpdateById(arg1:number,arg2:flakes.FlakeUpdate):Promise<flakes.Flake>;
