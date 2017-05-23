#include <stdlib.h>
#include <emscripten.h>
#include "../opus/include/opus.h"

#define MAX_FRAME_SIZE   5760
#define MAX_INPUT_BYTES  3840
#define MAX_OUTPUT_BYTES 4000

typedef struct Encoder {
   OpusEncoder* encoder;
   OpusDecoder* decoder;
   
   //I know libopus outputs unsigned chars
   //but it's supposed to accept signed shorts, right?
   //BUT when you .read() from Node, you get a
   //Node Buffer (unsigned char array)...
   //I'll just use an opus_int16 (to send to libopus)
   //just to be safe.

   //Assign PCM audio data to this array
   unsigned char    in_pcm[MAX_INPUT_BYTES];
   //Use to_big_endian to convert it and put it in this array
   opus_int16    in_big_endian[MAX_INPUT_BYTES];
   //Encode the audio from the last array and put it into this one
   unsigned char out_encoded[MAX_OUTPUT_BYTES];

   //Assign Opus audio data to this array
   unsigned char in_opus[MAX_FRAME_SIZE];
   //Decode the Opus audio to PCM audio
   opus_int16 in_decoded[MAX_OUTPUT_BYTES];
   //Convert the Big Endian PCM audio to Little Endian and put it into this one
   opus_int16 out_little_endian[MAX_OUTPUT_BYTES];

   int encoder_error;
   int decoder_error;
} Encoder;

void to_big_endian(unsigned char* in, int i, opus_int16* out) {
    for (;i--;) {
        out[i] = in[2*i+1]<<8|in[2*i];
    }
}

void to_little_endian(opus_int16* in, int i, opus_int16* out) {
    for (;i--;) {
        out[2*i]=in[i]&0xFF;
        out[2*i+1]=(in[i]>>8)&0xFF;
    }
}

EMSCRIPTEN_KEEPALIVE
Encoder* create_encoder_and_decoder(opus_int32 sample_rate, int channels, int application) {
    Encoder* enc = malloc(sizeof(Encoder));

    enc->encoder = opus_encoder_create( sample_rate, channels, application, &enc->encoder_error );
    enc->decoder = opus_decoder_create( sample_rate, channels, &enc->decoder_error );

    return enc;
}

EMSCRIPTEN_KEEPALIVE
int get_encoder_error(Encoder* encoder) {
    return encoder->encoder_error;
}

EMSCRIPTEN_KEEPALIVE
int get_decoder_error(Encoder* encoder) {
    return encoder->decoder_error;
}

EMSCRIPTEN_KEEPALIVE
int encode(Encoder* encoder, int length, int frame_size) {
    to_big_endian(encoder->in_pcm, length, encoder->in_big_endian);
    return opus_encode(
        encoder->encoder,
        encoder->in_big_endian,
        frame_size,
        encoder->out_encoded,
        MAX_OUTPUT_BYTES
    );
}

EMSCRIPTEN_KEEPALIVE
int decode(Encoder* encoder, int length) {
    int encoded_frames = opus_decode(
        encoder->decoder,
        encoder->in_opus,//opus, 
        length, 
        encoder->in_decoded, 
        MAX_FRAME_SIZE, 
        0
    );
    to_little_endian(encoder->in_decoded, MAX_OUTPUT_BYTES, encoder->out_little_endian);
    return encoded_frames;
}

EMSCRIPTEN_KEEPALIVE
void destroy_encoder(Encoder* encoder) {
    opus_encoder_destroy(encoder->encoder);
    opus_decoder_destroy(encoder->decoder);
    free(encoder);
}

//Could probably merge these into one with a switch using a number
//But since I'm not worried about space they can be separate
//It's a bit more semantic too, right?
EMSCRIPTEN_KEEPALIVE
unsigned char* get_in_pcm_offset(Encoder* encoder) {
    return encoder->in_pcm;
}

EMSCRIPTEN_KEEPALIVE
unsigned char* get_encoded_offset(Encoder* encoder) {
    return encoder->out_encoded;
}

EMSCRIPTEN_KEEPALIVE
unsigned char* get_in_opus_offset(Encoder* encoder) {
    return encoder->in_opus;
}

EMSCRIPTEN_KEEPALIVE
opus_int16* get_decoded_little_endian_offset(Encoder* encoder) {
    return encoder->out_little_endian;
}