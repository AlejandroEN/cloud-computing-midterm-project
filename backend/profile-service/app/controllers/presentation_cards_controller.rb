class PresentationCardsController < ApplicationController
  before_action :set_presentation_card, only: %i[ show update destroy ]

  # GET /presentation_cards
  def index
    @presentation_cards = PresentationCard.all

    render json: @presentation_cards
  end

  # GET /presentation_cards/1
  def show
    render json: @presentation_card
  end

  # POST /presentation_cards
  def create
    @presentation_card = PresentationCard.new(presentation_card_params)

    if @presentation_card.save
      render json: @presentation_card, status: :created, location: @presentation_card
    else
      render json: @presentation_card.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /presentation_cards/1
  def update
    if @presentation_card.update(presentation_card_params)
      render json: @presentation_card
    else
      render json: @presentation_card.errors, status: :unprocessable_entity
    end
  end

  # DELETE /presentation_cards/1
  def destroy
    @presentation_card.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_presentation_card
      @presentation_card = PresentationCard.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def presentation_card_params
      params.expect(presentation_card: [ :profile_id, :name, :content ])
    end
end
