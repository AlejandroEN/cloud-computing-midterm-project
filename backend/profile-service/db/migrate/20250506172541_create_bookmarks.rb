class CreateBookmarks < ActiveRecord::Migration[8.0]
  def change
    create_table :bookmarks, id: false do |t|
      t.bigint :post_id, null: false
      t.references :profile, null: false, foreign_key: true

      t.timestamps
    end

    execute "ALTER TABLE bookmarks ADD PRIMARY KEY (post_id, profile_id);"
  end
end