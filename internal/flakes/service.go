package flakes

import (
	"database/sql"
)

type FlakesService struct {
	a Adapter
}

func NewFlakesService(a Adapter) *FlakesService {
	return &FlakesService{a}
}

func (s *FlakesService) GetAll() ([]Flake, error) {
	return s.a.q.GetAll(s.a.ctx)
}

func (s *FlakesService) Create(name string, description *string, bowlId int64) (Flake, error) {
	descriptionVal := *description
	descriptionEmtpy := description == nil

	params := CreateParams{
		Name: name,
		Description: sql.NullString{
			String: descriptionVal,
			Valid: !descriptionEmtpy,
		},
		BowlID: bowlId,
	}

	return s.a.q.Create(s.a.ctx,params)
}

func (s *FlakesService) GetAllByBowlId(bowlId int64) ([]Flake, error) {
	return s.a.q.GetAllByBowlId(s.a.ctx, bowlId)
}

func (s *FlakesService) GetById(id int64) (Flake, error) {
	return s.a.q.GetById(s.a.ctx, id)
}

func (s *FlakesService) DeleteById(id int64) error {
	return s.a.q.DeleteById(s.a.ctx, id)
}

