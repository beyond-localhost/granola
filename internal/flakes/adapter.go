package flakes

import "context"

type Adapter struct {
	q *Queries
	ctx context.Context
}

func NewFlakeAdapter(q Queries) Adapter {
	return Adapter{}
}

func (a *Adapter) SetQueries(qq *Queries) {
	a.q = qq
}

func (a *Adapter) SetCtx(ctx context.Context) {
	a.ctx = ctx
}