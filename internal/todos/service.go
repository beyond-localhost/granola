package todos

import (
	"fmt"
	"time"
)

type TodosService struct {
	repo TodoRepository
}


/**
** TODO: synchronize the time between client and go
**/
func isoTimeToTime(iso string) (time.Time, error) {
	t, err := time.Parse(time.RFC3339Nano, iso)
	if err != nil {
		zero := time.Time{}
		return zero, err
	}
	return t, nil	
}


func NewTodosService(repo TodoRepository) *TodosService {
	return &TodosService{repo}
}

func (s *TodosService) Create(flakeId int64, scheduledAtISO string) (*TodoWithFlakeName, error) {
	scheduledAt, err := isoTimeToTime(scheduledAtISO)
	if err != nil {
		return nil, err
	}

	return s.repo.Create(flakeId, scheduledAt)
}

func (s *TodosService) GetAll() ([]Todo, error) {
	return s.repo.GetAll()
}

func (s *TodosService) GetAllByFlakeId(flakeId int64) ([]Todo, error) {
	return s.repo.GetAllByFlakeId(flakeId)
}

func (s *TodosService) GetAllByRange(fromISO string, toISO string) ([]TodoWithFlakeName, error) {
	from, err := isoTimeToTime(fromISO)
	if err != nil {
		return nil, err
	}
	
	to, err := isoTimeToTime(toISO)
	if err != nil {
		return nil, err
	}

	if from.Equal(to) || from.After(to) {
		return nil, fmt.Errorf("the before(%v) should be 'before' than after(%v)", from, to)
	}

	fmt.Printf("The from is %v and the to is %v", from, to)

	return s.repo.GetAllByRange(from, to)
}

func (s *TodosService) SetDone(id int64) (bool, error) {
	return s.repo.SetDone(id)
}


func (s *TodosService) Remove(id int64) (error) {
	return s.repo.Remove(id)
}