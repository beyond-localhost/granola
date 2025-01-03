package bowls

type BowelService struct {
	repo BowlRepository
}

func NewBowelService(repo BowlRepository) *BowelService {
	return &BowelService{repo}
}

func (s *BowelService) GetAll() ([]Bowl, error) {
	return s.repo.GetAll()
}

func (s *BowelService) GetById(id int) (*Bowl, error) {
	return s.repo.GetById(id)
}

func (s *BowelService) Create(name string, description *string) (*Bowl, error) {
	return s.repo.Create(name, description)
}

func (s *BowelService) UpdateById(id int, update BowlUpdate) (*Bowl, error) {
	return s.repo.UpdateById(id, update)
}

func (s *BowelService) DeleteById(id int) error {
	return s.repo.DeleteById(id)
}
