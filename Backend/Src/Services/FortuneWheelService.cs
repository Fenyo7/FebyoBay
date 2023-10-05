using System;
using greenBayAPI.Models;

namespace greenBayAPI.Services
{
    public class FortuneWheelService
    {
        // Define the number of segments on the wheel.
        private const int NumberOfSegments = 10;

        public int SpinWheel()
        {
            // Generate a random segment.
            Random rnd = new Random();
            int selectedSegment = rnd.Next(0, NumberOfSegments);
            return selectedSegment;
        }
    }
}
