class UpdateProfilesForStarsAndImageKey < ActiveRecord::Migration[8.0]
  def change
    change_column :profiles, :stars, :decimal, precision: 2, scale: 1
    rename_column :profiles, :image_url, :image_key
  end
end
