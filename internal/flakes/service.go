package flakes

type FlakeService struct {
	repo FlakeRepository
}

func NewFlakeService(repo FlakeRepository) *FlakeService {
	return &FlakeService{repo}
}



func (s *FlakeService) Create(name string, description *string, bowlId int64) (*Flake, error) {
	return s.repo.Create(name, description, bowlId)
}

func (s *FlakeService) GetAll() ([]Flake, error) {
	return s.repo.GetAll()
}

func (s *FlakeService) GetAllByBowlId(bowlId int64) ([]Flake, error) {
	return s.repo.GetAllByBowlId(bowlId)
}

func (s *FlakeService) GetById(id int64) (*Flake, error) {
	return s.repo.GetById(id)
}

func (s *FlakeService) UpdateById(id int64, update FlakeUpdate) (*Flake, error) {
	return s.repo.UpdateById(id, update)
}

func (s *FlakeService) DeleteById(id int64) error {
	return s.repo.DeleteById(id)
}

