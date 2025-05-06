class CreateBookmarks < ActiveRecord::Migration[8.0]
  def change
    create_table :bookmarks do |t|
      t.bigint :post_id, null: false
      t.references :profile, null: false, foreign_key: true

      t.timestamps
    end
  end
end
