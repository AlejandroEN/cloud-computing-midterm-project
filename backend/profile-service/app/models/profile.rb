class Profile < ApplicationRecord
  belongs_to :institution
  before_create :set_random_nickname

  private

  def set_random_nickname
    self.nickname ||= generate_randon_nickname
  end

  def generate_randon_nickname
    adjectives = %w[funky cool fast happy silly wild funny]
    animals = %w[donkey panda lion tiger elephant giraffe penguin wolf]

    "#{adjectives.sample}_#{animals.sample}"
  end
end
