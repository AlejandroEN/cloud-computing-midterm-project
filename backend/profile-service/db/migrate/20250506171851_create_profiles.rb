class CreateProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :profiles do |t|
      t.string :nickname, null: false
      t.string :name
      t.string :last_name
      t.string :email, null: false
      t.references :institution, null: false, foreign_key: true
      t.date :birthday
      t.string :gender
      t.string :picture_url, null: false
      t.integer :stars

      t.timestamps
    end
    add_index :profiles, :nickname, unique: true
    add_index :profiles, :email, unique: true
  end
end
