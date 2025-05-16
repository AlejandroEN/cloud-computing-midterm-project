class UpdateInstitutionsForImageKey < ActiveRecord::Migration[8.0]
  def change
    rename_column :institutions, :image_url, :image_key
  end
end
