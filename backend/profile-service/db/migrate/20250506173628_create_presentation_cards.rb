class CreatePresentationCards < ActiveRecord::Migration[8.0]
  def change
    create_table :presentation_cards do |t|
      t.references :profile, null: false, foreign_key: true
      t.string :name, null: false
      t.string :content, null: false, limit:1000

      t.timestamps
    end
  end
end
