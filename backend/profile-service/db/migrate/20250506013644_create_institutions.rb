class CreateInstitutions < ActiveRecord::Migration[8.0]
  def change
    create_table :institutions do |t|
      t.string :name, null: false
      t.string :domain, null: false
      t.string :image_key, null: false

      t.timestamps
    end
    add_index :institutions, :name, unique: true
    add_index :institutions, :domain, unique: true
    add_index :institutions, :image_key, unique: true
  end
end
