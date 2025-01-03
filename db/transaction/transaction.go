package transaction

import "database/sql"

// Tx is a helper function to run a function within a transaction.
// If the function returns an error, the transaction is rolled back.
// Note that If the function panics, the transaction is rolled back and panic again.
func Tx[T any](db *sql.DB,fn func(*sql.Tx) (T, error)) (ret T, txErr error) {
	tx, err := db.Begin()
	if err != nil {
		var zero T
		return	zero, err
	}

	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if txErr != nil {
				tx.Rollback()
		} else {
				txErr = tx.Commit()
		}
	}()

	ret, txErr = fn(tx)
	if txErr != nil {
			var zero T
			return zero, txErr
	}

	return ret, nil
}