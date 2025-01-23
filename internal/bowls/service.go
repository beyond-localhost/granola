package bowls

type BowlsService struct {
	a *Adapter
}

func NewBowlsService(a *Adapter) *BowlsService {
	return &BowlsService{a}
}

func (s *BowlsService) GetAll() ([]Bowl, error) {
	return s.a.q.GetAll(s.a.ctx)
}

func (s *BowlsService) GetById(id int64) (Bowl, error) {
	return s.a.q.GetById(s.a.ctx, id)
}

func (s *BowlsService) Create(name string, description string) (Bowl, error) {
	params := CreateParams{
		Name: name,
		Description: &description,
	}

	return s.a.q.Create(s.a.ctx, params)
}

func (s *BowlsService) DeleteById(id int64) error {
	return s.a.q.DeleteById(s.a.ctx, id)
}
