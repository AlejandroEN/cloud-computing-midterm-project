require "test_helper"

class ProfilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @profile = profiles(:one)
  end

  test "should get index" do
    get profiles_url, as: :json
    assert_response :success
  end

  test "should create profile" do
    assert_difference("Profile.count") do
      post profiles_url, params: { profile: { birthday: @profile.birthday, email: @profile.email, gender: @profile.gender, institution_id: @profile.institution_id, lastname: @profile.lastname, name: @profile.name, nickname: @profile.nickname, image_url: @profile.image_url, stars: @profile.stars } }, as: :json
    end

    assert_response :created
  end

  test "should show profile" do
    get profile_url(@profile), as: :json
    assert_response :success
  end

  test "should update profile" do
    patch profile_url(@profile), params: { profile: { birthday: @profile.birthday, email: @profile.email, gender: @profile.gender, institution_id: @profile.institution_id, lastname: @profile.lastname, name: @profile.name, nickname: @profile.nickname, image_url: @profile.image_url, stars: @profile.stars } }, as: :json
    assert_response :success
  end

  test "should destroy profile" do
    assert_difference("Profile.count", -1) do
      delete profile_url(@profile), as: :json
    end

    assert_response :no_content
  end
end
