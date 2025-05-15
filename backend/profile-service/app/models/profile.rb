class Profile < ApplicationRecord
  belongs_to :institution
  before_create :set_random_nickname

  validates :nickname, presence: true, uniqueness: true
  validates :stars, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true

  private

  def set_random_nickname
    loop do
      self.nickname = generate_random_nickname
      break unless Profile.exists?(nickname: nickname)
    end
  end

  def generate_random_nickname
    "user_#{SecureRandom.alphanumeric(8)}"
  end
end
