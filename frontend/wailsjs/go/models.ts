export namespace bowls {
	
	export class Bowl {
	    id: number;
	    name: string;
	    description?: string;
	
	    static createFrom(source: any = {}) {
	        return new Bowl(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	    }
	}
	export class BowlUpdate {
	    name?: string;
	    description?: string;
	
	    static createFrom(source: any = {}) {
	        return new BowlUpdate(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	    }
	}

}

export namespace flakes {
	
	export class Flake {
	    id: number;
	    name: string;
	    description?: string;
	    bowlId: number;
	
	    static createFrom(source: any = {}) {
	        return new Flake(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.bowlId = source["bowlId"];
	    }
	}
	export class FlakeUpdate {
	    name?: string;
	    description?: string;
	
	    static createFrom(source: any = {}) {
	        return new FlakeUpdate(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	    }
	}

}

export namespace time {
	
	export class Time {
	
	
	    static createFrom(source: any = {}) {
	        return new Time(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

export namespace todos {
	
	export class Todo {
	    id: number;
	    flakeId: number;
	    done: boolean;
	    scheduledAt: time.Time;
	
	    static createFrom(source: any = {}) {
	        return new Todo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.flakeId = source["flakeId"];
	        this.done = source["done"];
	        this.scheduledAt = this.convertValues(source["scheduledAt"], time.Time);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

