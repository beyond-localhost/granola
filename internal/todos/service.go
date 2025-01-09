package todos

import (
	"fmt"
	"time"
)

type TodosService struct {
	repo TodoRepository
}

func NewTodosService(repo TodoRepository) *TodosService {
	return &TodosService{repo}
}

func (s *TodosService) Create(flakeId int64, scheduledAt time.Time) (*Todo, error) {
	return s.repo.Create(flakeId, scheduledAt)
}

func (s *TodosService) GetAllByFlakeId(flakeId int64) ([]Todo, error) {
	return s.repo.GetAllByFlakeId(flakeId)
}

func (s *TodosService) GetAllByRange(from time.Time, to time.Time) ([]TodoWithFlakeName, error) {
	if from.Equal(to) || from.After(to) {
		return nil, fmt.Errorf("the before(%v) should be 'before' than after(%v)", from, to)
	}
	return s.repo.GetAllByRange(from, to)
}

func (s *TodosService) SetDone(id int64) (bool, error) {
	return s.repo.SetDone(id)
}