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

