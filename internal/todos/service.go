package todos

import (
	"fmt"
	"time"
)

type TodosService struct {
	a *Adapter
}


func isoTimeToTime(iso string) (time.Time, error) {
	t, err := time.Parse(time.RFC3339Nano, iso)
	if err != nil {
		zero := time.Time{}
		return zero, err
	}
	return t, nil	
}


func NewTodosService(a *Adapter) *TodosService {
	return &TodosService{a}
}

func (s *TodosService) Create(flakeId int64, scheduledAtISO string) (Todo, error) {
	scheduledAt, err := isoTimeToTime(scheduledAtISO)
	
	if err != nil {
		var zero Todo
		return zero, err
	}

	params := CreateParams{
		FlakeID: flakeId,
		ScheduledAt: scheduledAt,
	}

	return s.a.q.Create(s.a.ctx, params)
}

func (s *TodosService) GetAll() ([]Todo, error) {
	return s.a.q.GetAll(s.a.ctx)
}

func (s *TodosService) GetAllByFlakeId(flakeId int64) ([]Todo, error) {
	return s.a.q.GetAllByFlakeId(s.a.ctx, flakeId)
}

func (s *TodosService) GetAllByRange(fromISO string, toISO string) ([]GetAllByRangeRow, error) {
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

	params := GetAllByRangeParams{
		FromScheduledAt: from,
		ToScheduledAt: to,
	}

	return s.a.q.GetAllByRange(s.a.ctx, params)
}

func (s *TodosService) SetDone(id int64, nextDone bool) error {
	var done int64
	if nextDone {
		done = 1
	} else {
		done = 0
	}
	params := SetDoneParams{
		Done: done,
		ID: id,
	}
	return s.a.q.SetDone(s.a.ctx, params)
}


func (s *TodosService) Remove(id int64) (error) {
	return s.a.q.DeleteById(s.a.ctx, id)
}