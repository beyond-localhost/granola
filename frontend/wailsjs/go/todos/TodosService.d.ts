// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {todos} from '../models';

export function Create(arg1:number,arg2:string):Promise<todos.Todo>;

export function GetAll():Promise<Array<todos.Todo>>;

export function GetAllByFlakeId(arg1:number):Promise<Array<todos.Todo>>;

export function GetAllByRange(arg1:string,arg2:string):Promise<Array<todos.GetAllByRangeRow>>;

export function Remove(arg1:number):Promise<void>;

export function SetDone(arg1:number,arg2:boolean):Promise<void>;
