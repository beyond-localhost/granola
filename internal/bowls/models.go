// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0

package bowls

type Bowl struct {
	ID          int64   `json:"id"`
	Name        string  `json:"name"`
	Description *string `json:"description"`
}
