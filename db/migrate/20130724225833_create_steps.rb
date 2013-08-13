class CreateSteps < ActiveRecord::Migration
  def change
    create_table :steps do |t|
      t.string  :title
      t.text    :body
      t.text    :selector
      t.integer :tutorial_id
      t.timestamps
    end
  end
end
