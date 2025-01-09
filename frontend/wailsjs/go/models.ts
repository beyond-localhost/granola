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
	    scheduledAt: Date;
	
	    static createFrom(source: any = {}) {
	        return new Todo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.flakeId = source["flakeId"];
	        this.done = source["done"];
	        this.scheduledAt = new Date(source["scheduledAt"]);
	    }
	}
	export class TodoWithFlakeName {
	    id: number;
	    flakeId: number;
	    done: boolean;
	    scheduledAt: Date;
	    flakeName: string;
	
	    static createFrom(source: any = {}) {
	        return new TodoWithFlakeName(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.flakeId = source["flakeId"];
	        this.done = source["done"];
	        this.scheduledAt = new Date(source["scheduledAt"]);
	        this.flakeName = source["flakeName"];
	    }
	}

}

