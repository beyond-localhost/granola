package bowls

type BowlsService struct {
	repo BowlRepository
}

func NewBowlsService(repo BowlRepository) *BowlsService {
	return &BowlsService{repo}
}

func (s *BowlsService) GetAll() ([]Bowl, error) {
	return s.repo.GetAll()
}

func (s *BowlsService) GetById(id int) (*Bowl, error) {
	return s.repo.GetById(id)
}

func (s *BowlsService) Create(name string, description *string) (*Bowl, error) {
	return s.repo.Create(name, description)
}

func (s *BowlsService) UpdateById(id int, update BowlUpdate) (*Bowl, error) {
	return s.repo.UpdateById(id, update)
}

func (s *BowlsService) DeleteById(id int) error {
	return s.repo.DeleteById(id)
}
