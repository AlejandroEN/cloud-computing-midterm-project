require "test_helper"

class PresentationCardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @presentation_card = presentation_cards(:one)
  end

  test "should get index" do
    get presentation_cards_url, as: :json
    assert_response :success
  end

  test "should create presentation_card" do
    assert_difference("PresentationCard.count") do
      post presentation_cards_url, params: { presentation_card: { content: @presentation_card.content, name: @presentation_card.name, profile_id: @presentation_card.profile_id } }, as: :json
    end

    assert_response :created
  end

  test "should show presentation_card" do
    get presentation_card_url(@presentation_card), as: :json
    assert_response :success
  end

  test "should update presentation_card" do
    patch presentation_card_url(@presentation_card), params: { presentation_card: { content: @presentation_card.content, name: @presentation_card.name, profile_id: @presentation_card.profile_id } }, as: :json
    assert_response :success
  end

  test "should destroy presentation_card" do
    assert_difference("PresentationCard.count", -1) do
      delete presentation_card_url(@presentation_card), as: :json
    end

    assert_response :no_content
  end
end
